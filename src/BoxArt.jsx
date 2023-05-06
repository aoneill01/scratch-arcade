import { useEffect, useRef, useState } from "react";

export default function BoxArt({ title, theme, thumbnail, x = 0, y = 0, scale = 1.0 }) {
  const ref = useRef();
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");

  useEffect(() => {
    if (!ref.current) return;

    const calculateSpacing = () => {
      const dummyTitle = ref.current.querySelector(".title");

      dummyTitle.textContent = title;

      let lastSpace;
      let line1LastIndex;

      for (let i = 1; i < title.length; i++) {
        if (title[i] === " ") {
          lastSpace = i;
          continue;
        }
        if (dummyTitle.getSubStringLength(0, i + 1) > 260) {
          line1LastIndex = lastSpace ? lastSpace : i - 1;
          setLine1(title.substring(0, line1LastIndex));
          break;
        }
      }

      if (!line1LastIndex) {
        setLine1(title);
        return;
      }

      dummyTitle.textContent = title.substring(line1LastIndex).trim();

      for (let i = 1; i < dummyTitle.textContent.length; i++) {
        if (dummyTitle.getSubStringLength(0, i + 1) > 260) {
          setLine2(dummyTitle.textContent.substring(0, i - 1));
          return;
        }
      }

      setLine2(dummyTitle.textContent);
    };

    setTimeout(calculateSpacing, 100);
  }, [title]);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} style={{ transformOrigin: `150px 400px` }} ref={ref}>
      <rect width="300" height="400" fill={theme.fill} />
      <image href={thumbnail} width="260" height="195" x="20" y="20" />
      <path d="M 20,216 l 262,-50 l 0,50" fill={theme.fill} />
      <text className="title" fill="transparent"></text>
      <text x="20" y="270" transform="skewY(-11)" className="title" fill="white">
        {line1}
      </text>
      <text x="20" y="312" transform="skewY(-11)" className="title" fill="white">
        {line2}
      </text>
      <rect width="300" height="60" y="340" fill="white" />
      <image
        href="https://raw.githubusercontent.com/LLK/scratch-www/develop/static/images/logo_sm.png"
        width="160"
        x="120"
        y="312"
      />
      <image href="https://mirrors.creativecommons.org/presskit/icons/cc.svg" width="30" height="30" x="20" y="354" />
    </g>
  );
}
