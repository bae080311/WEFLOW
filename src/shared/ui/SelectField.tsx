"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { FIELD_LABEL } from "./fieldStyles";

export type SelectOption = { value: string; label: string };

export type SelectFieldProps = {
  label: ReactNode;
  options: readonly SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
};

// 커스텀 셀렉트(combobox + listbox): 애니메이션 열림, 선택 체크 표시, 키보드 탐색, 바깥 클릭 닫기.
export function SelectField({
  label,
  options,
  value = "",
  onValueChange,
  placeholder = "선택해 주세요",
  required,
  error,
  id,
  name,
  className,
  disabled,
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const listId = `${fieldId}-list`;
  const errorId = `${fieldId}-error`;
  const optionId = (index: number) => `${fieldId}-opt-${index}`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((option) => option.value === value) ?? null;

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // 열릴 때 listbox 로 포커스 이동(DOM side effect — setState 없음).
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  function openMenu() {
    const initial = selected ? options.findIndex((o) => o.value === selected.value) : 0;
    setActiveIndex(initial >= 0 ? initial : 0);
    setOpen(true);
  }

  function choose(option: SelectOption) {
    onValueChange?.(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu();
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) choose(option);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-2" ref={rootRef}>
      <span id={labelId} className={FIELD_LABEL}>
        {label}
        {required ? (
          <span className="text-danger" aria-hidden>
            {" *"}
          </span>
        ) : null}
      </span>

      <div className="relative">
        <button
          ref={triggerRef}
          id={fieldId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={labelId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onTriggerKeyDown}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-input border bg-surface-2 px-3 text-left text-body transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:opacity-50",
            open ? "border-brand-cyan" : "border-border hover:border-brand-cyan/50",
            error && "border-danger",
            className,
          )}
        >
          <span className={cn("truncate", selected ? "text-text" : "text-text-subtle")}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-text-muted transition-[transform,color] duration-200 motion-reduce:transition-none",
              open && "rotate-180 text-brand-cyan",
            )}
            aria-hidden
          />
        </button>

        {name ? <input type="hidden" name={name} value={value} readOnly /> : null}

        {open ? (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            tabIndex={-1}
            onKeyDown={onListKeyDown}
            className="animate-select-in absolute z-20 mt-2 max-h-64 w-full origin-top overflow-auto rounded-card border border-border bg-surface p-1 shadow-xl focus:outline-none"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => choose(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-control px-3 py-2.5 text-body transition-colors duration-150",
                    isActive ? "bg-surface-2 text-text" : "text-text-muted",
                    isSelected && "text-text",
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected ? <Check className="size-4 text-brand-cyan" aria-hidden /> : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
