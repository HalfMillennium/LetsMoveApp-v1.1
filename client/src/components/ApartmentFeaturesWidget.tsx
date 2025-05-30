import React from "react";
import parse, { HTMLReactParserOptions } from "html-react-parser";
import { DOMNode, Element } from "domhandler";

const originalHtml = `
  <section>
    <h2>Policies</h2>
    <div>
      <ul>
        <li><p>Guarantors accepted</p></li>
        <li><p>Pets allowed</p></li>
        <li><p>Smoke-free</p></li>
      </ul>
    </div>
  </section>
`;

export const ApartmentFeaturesWidget: React.FC = () => {
  const transform = (node: DOMNode): React.ReactNode | undefined => {
    if (node.type === "tag") {
      const el = node as Element;
      const { name, children } = el;

      const classMap: Record<string, string> = {
        h2: "text-lg font-light text-gray-900 mb-4",
        p: "text-base text-gray-700",
        ul: "space-y-2",
        li: "text-base text-gray-700",
        div: "space-y-8",
      };

      const transformedChildren = children?.map((c, i) => (
        <React.Fragment key={i}>{transform(c)}</React.Fragment>
      ));

      return React.createElement(
        name,
        { className: classMap[name] || undefined },
        transformedChildren,
      );
    }

    return undefined; // Let html-react-parser handle other node types (text, etc.)
  };

  const options: HTMLReactParserOptions = { replace: transform };

  return <div>{parse(originalHtml, options)}</div>;
};
