import { describe, it, expect } from "vitest";
import { EXTERNAL_LINKS, EXTERNAL_LINK_ATTRS } from "./links";

describe("EXTERNAL_LINKS", () => {
  it("requirements §7 정확값과 일치한다", () => {
    expect(EXTERNAL_LINKS.tel).toBe("tel:01029717280");
    expect(EXTERNAL_LINKS.kakao).toBe("http://pf.kakao.com/_xntCbX");
    expect(EXTERNAL_LINKS.blog).toBe("https://m.blog.naver.com/weflowlab");
    expect(EXTERNAL_LINKS.instagram).toBe("https://www.instagram.com/weflowlab.kr");
    expect(EXTERNAL_LINKS.facebook).toBe("https://www.facebook.com/profile.php?id=61590187124682");
  });

  it("안전한 외부 앵커 속성을 노출한다", () => {
    expect(EXTERNAL_LINK_ATTRS).toEqual({ target: "_blank", rel: "noopener noreferrer" });
  });
});
