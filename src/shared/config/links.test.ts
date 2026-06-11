import { describe, it, expect } from "vitest";
import { externalLinks, externalLinkAttrs } from "./links";

describe("externalLinks", () => {
  it("requirements §7 정확값과 일치한다", () => {
    expect(externalLinks.tel).toBe("tel:01029717280");
    expect(externalLinks.kakao).toBe("http://pf.kakao.com/_xntCbX");
    expect(externalLinks.blog).toBe("https://m.blog.naver.com/weflowlab");
    expect(externalLinks.instagram).toBe("https://www.instagram.com/weflowlab.kr");
    expect(externalLinks.facebook).toBe("https://www.facebook.com/profile.php?id=61590187124682");
  });

  it("안전한 외부 앵커 속성을 노출한다", () => {
    expect(externalLinkAttrs).toEqual({ target: "_blank", rel: "noopener noreferrer" });
  });
});
