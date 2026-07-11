import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import { getBindingValue } from "@rbxts/pretty-react-hooks";
import type { PropsWithChildren } from "@rbxts/react";

interface ShowProps {
	show: BindingOrValue<boolean>;
}

export function Show({ children, show }: PropsWithChildren<ShowProps>) {
	return getBindingValue(show) === true ? children : undefined;
}
