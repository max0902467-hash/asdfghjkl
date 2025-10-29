
export type ElementType = 'text' | 'image' | 'shape';

export interface ElementStyle {
  fontSize?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

export interface SlideElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string; // Text content, image URL, or shape type
  style: ElementStyle;
}

export interface Slide {
  id: string;
  elements: SlideElement[];
  background: string;
}

export interface Presentation {
  title: string;
  slides: Slide[];
}
