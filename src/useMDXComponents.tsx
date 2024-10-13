import type { MDXComponents } from "mdx/types";
import {ComponentPropsWithoutRef} from "react";

export function Heading(props: ComponentPropsWithoutRef<"h1">) {
    return <h1 className="heading" {...props} />;
}
export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: Heading,
        ...components,
    };
}