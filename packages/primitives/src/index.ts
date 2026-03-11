/**
 * @astacinco/rn-primitives
 *
 * Theme-aware UI primitives for React Native.
 * All components automatically adapt to light/dark modes.
 *
 * @example
 * ```typescript
 * import { Text, Button, Card, VStack } from '@astacinco/rn-primitives';
 *
 * function MyScreen() {
 *   return (
 *     <VStack spacing="md">
 *       <Text variant="title">Welcome</Text>
 *       <Card>
 *         <Text>Card content</Text>
 *       </Card>
 *       <Button label="Get Started" onPress={() => {}} />
 *     </VStack>
 *   );
 * }
 * ```
 */

// Text
export { Text } from './Text';
export type { TextProps, TextVariant } from './Text';

// Button
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

// Card
export { Card } from './Card';
export type { CardProps, CardVariant } from './Card';

// Stack
export { VStack, HStack } from './Stack';
export type { StackProps, StackSpacing, StackAlign, StackJustify } from './Stack';

// Container
export { Container } from './Container';
export type { ContainerProps } from './Container';

// Input
export { Input } from './Input';
export type { InputProps } from './Input';

// Divider
export { Divider } from './Divider';
export type { DividerProps, DividerVariant } from './Divider';

// Switch
export { Switch } from './Switch';
export type { SwitchProps, SwitchSize } from './Switch';

// Avatar
export { Avatar } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';

// Badge
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant, BadgePosition, BadgeSize } from './Badge';
