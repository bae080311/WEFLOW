"use client";

import { useCallback, useEffect, useState } from "react";
import { reservationService, type Reservation } from "@/entities/reservation";
import { inquiryService, type Inquiry } from "@/entities/inquiry";

// 예약·문의 실시간 구독 + 수동 새로고침. 컴파일러 규칙대로 side effect 는 useEffect 안에서만.
export function useAdminData() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const refresh = useCallback(async () => {
    const [nextReservations, nextInquiries] = await Promise.all([
      reservationService.list(),
      inquiryService.list(),
    ]);
    setReservations(nextReservations);
    setInquiries(nextInquiries);
  }, []);

  useEffect(() => {
    let alive = true;
    reservationService.list().then((data) => {
      if (alive) setReservations(data);
    });
    inquiryService.list().then((data) => {
      if (alive) setInquiries(data);
    });
    const unsubscribeReservations = reservationService.subscribe(setReservations);
    const unsubscribeInquiries = inquiryService.subscribe(setInquiries);
    return () => {
      alive = false;
      unsubscribeReservations();
      unsubscribeInquiries();
    };
  }, []);

  return { reservations, inquiries, refresh };
}
