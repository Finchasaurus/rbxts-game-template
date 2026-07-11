import type { Entity } from "@rbxts/jecs";
import type { InstanceProps } from "@rbxts/react";

declare type NativeProps<I extends Instance> = InstanceProps<I>;
declare type NativePropsExcept<I extends Instance, K extends keyof InstanceProps<I>> = Omit<InstanceProps<I>, K>;
declare type PropsWithNative<I extends Instance, P = object> = P & { native?: NativeProps<I> };
declare type PropsWithNativeExcept<I extends Instance, K extends keyof InstanceProps<I>, P = object> = P & {
	native?: NativePropsExcept<I, K>;
};
declare type PropsWithEntity<P = object> = P & {
	entity: Entity;
};
