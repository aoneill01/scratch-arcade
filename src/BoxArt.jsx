import { useEffect, useRef, useState } from "react";

export default function BoxArt({ title, theme, thumbnail, x = 0, y = 0 }) {
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
        if (dummyTitle.getSubStringLength(0, i + 1) > 130) {
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
        if (dummyTitle.getSubStringLength(0, i + 1) > 130) {
          setLine2(dummyTitle.textContent.substring(0, i - 1));
          return;
        }
      }

      setLine2(dummyTitle.textContent);
    };

    setTimeout(calculateSpacing, 100);
  }, [title]);

  return (
    <g transform={`translate(${x}, ${y})`} ref={ref}>
      <rect width="150" height="200" fill={theme.fill} />
      <image href={thumbnail} width="130" height="97.5" x="10" y="10" />
      <path d="M 10,108 l 131,-25 l 0,25" fill={theme.fill} />
      <text className="title" fill="transparent"></text>
      <text x="10" y="135" transform="skewY(-11)" className="title" fill="white">
        {line1}
      </text>
      <text x="10" y="156" transform="skewY(-11)" className="title" fill="white">
        {line2}
      </text>
      <rect width="150" height="30" y="170" fill="white" />
      <image
        href="https://raw.githubusercontent.com/LLK/scratch-www/develop/static/images/logo_sm.png"
        width="80"
        x="60"
        y="156"
      />
      <image href="https://mirrors.creativecommons.org/presskit/icons/cc.svg" width="15" height="15" x="10" y="177" />
    </g>
  );
}
