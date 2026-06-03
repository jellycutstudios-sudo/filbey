---
name: Crunch & Comfort
colors:
  surface: '#fff8f6'
  surface-dim: '#ead6d2'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ee'
  surface-container: '#fee9e6'
  surface-container-high: '#f8e4e0'
  surface-container-highest: '#f2deda'
  on-surface: '#241917'
  on-surface-variant: '#584140'
  inverse-surface: '#3a2e2b'
  inverse-on-surface: '#ffedea'
  outline: '#8b716f'
  outline-variant: '#dfbfbd'
  surface-tint: '#aa3436'
  primary: '#5d000c'
  on-primary: '#ffffff'
  primary-container: '#80141c'
  on-primary-container: '#ff8b87'
  inverse-primary: '#ffb3af'
  secondary: '#855400'
  on-secondary: '#ffffff'
  secondary-container: '#fdae41'
  on-secondary-container: '#6d4400'
  tertiary: '#2d2b1f'
  on-tertiary: '#ffffff'
  tertiary-container: '#434134'
  on-tertiary-container: '#b1ad9c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3af'
  on-primary-fixed: '#410006'
  on-primary-fixed-variant: '#891b22'
  secondary-fixed: '#ffddb7'
  secondary-fixed-dim: '#ffb95e'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#e8e2d0'
  tertiary-fixed-dim: '#ccc6b5'
  on-tertiary-fixed: '#1e1c11'
  on-tertiary-fixed-variant: '#4a4739'
  background: '#fff8f6'
  on-background: '#241917'
  surface-variant: '#f2deda'
typography:
  display:
    fontFamily: Anton
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 52px
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 36px
  headline-md:
    fontFamily: Anton
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 4px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered to evoke the high-energy, sensory experience of a premium street-food café. The brand personality balances the aggressive urgency of a quick-service restaurant with the welcoming warmth of a neighborhood hangout. The target audience is urban foodies seeking both indulgence and reliability.

The visual style is **Modern / High-Contrast**, leaning into a clean "Boutique Fast-Casual" aesthetic. It utilizes bold, massive typography to shout its personality while maintaining a sophisticated cream-based backdrop to ensure the interface feels appetizing and approachable rather than industrial. Every element is designed to amplify the "crunch" (vibrancy) and the "comfort" (softness and warmth).

## Colors

The palette is driven by physiological appetite triggers. 
- **Primary (Deep Red):** Used for critical actions, price points, and "order now" buttons. It provides the urgency and brand recognition.
- **Secondary (Golden Orange):** Used for highlighting features, "crunch" descriptors, and accented UI elements like ratings or badges.
- **Background (Cream):** Replaces pure white for the main canvas to reduce visual fatigue and provide a softer, more "cafe-like" atmosphere.
- **Surface (White):** Reserved for elevated cards and menu item containers to create a crisp, clean distinction from the background.
- **Text (Dark Charcoal):** Ensures maximum legibility and a grounded feel, avoiding the harshness of pure black.

## Typography

This design system uses a dual-font strategy. **Anton** provides a bold, condensed, and impactful presence for headlines, mimicking classic fast-food signage and woodblock posters. It is almost exclusively used in uppercase to maintain high energy. 

**Inter** serves as the functional workhorse for menus, descriptions, and UI controls. Its neutral, systematic nature provides the "clean" counterpoint to the aggressive headings, ensuring that nutritional info and ingredient lists remain highly readable. Use `label-lg` for button text and category headers to maintain a sense of structured urgency.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a generous 8px baseline. 
- **Desktop:** 12-column grid with 24px gutters. Use large 40px margins to let the content breathe, emphasizing the premium nature of the café.
- **Mobile:** 4-column grid with 16px margins. Content cards should typically span the full width to maximize food imagery size.

Spacing should be used to group related items (e.g., a burger title and its price) closely with `stack-sm`, while separating distinct menu categories with `stack-lg`. High-quality food photography should be treated as a primary layout element, often breaking the grid or bleeding to the edges in mobile views.

## Elevation & Depth

This design system utilizes **Tonal Layers** combined with **Ambient Shadows**. 
1. **Level 0 (Background):** The Cream (#FFF9E6) base layer.
2. **Level 1 (Cards/Surfaces):** Pure White (#FFFFFF) surfaces with a subtle, low-opacity shadow (Color: #2A1F1D at 5% opacity, Y: 4, Blur: 12). This makes menu items feel "lifted" and touchable.
3. **Level 2 (Interactive/Floating):** Primary buttons and active states use a slightly more pronounced shadow with a hint of the Primary Red in the shadow tint to create a "glow" effect, suggesting warmth and energy.

Avoid harsh black shadows or heavy borders. The depth should feel organic and soft, like the "comfort" side of the brand tagline.

## Shapes

The shape language is consistently **Rounded**. The `0.5rem` (8px) base radius is applied to all buttons, input fields, and small UI components. Larger containers like menu cards and promotional banners use `rounded-xl` (1.5rem) to evoke a friendly, non-threatening, and "squishy" aesthetic that complements the comfort food theme. 

Circular shapes are reserved specifically for price badges and "add to cart" icons to create a distinct visual shorthand for action and value.

## Components

- **Buttons:** Primary buttons are Solid Deep Red with White `label-lg` text. They use `rounded-full` (pill-shaped) geometry for a friendly feel. Secondary buttons use a Golden Orange outline with an 8px radius.
- **Menu Cards:** White surfaces with 24px padding and 24px rounded corners. The image should occupy the top half of the card, often featuring a subtle "zoom" hover effect.
- **Chips:** Used for dietary tags (e.g., "Spicy," "Vegan"). Use a subtle tint of the Secondary color (Golden Orange at 15% opacity) with Dark Charcoal text.
- **Input Fields:** Cream-colored backgrounds with a subtle Dark Charcoal border (1px, 20% opacity). On focus, the border thickens and changes to the Primary Deep Red.
- **Price Badges:** Floating Golden Orange circles with White `label-lg` text, positioned on the top-right corner of product images.
- **Lists:** Clean, borderless list items with 16px vertical spacing, using a small Golden Orange dot as a bullet point for ingredients.