
import { Presentation } from './types';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_PRESENTATION: Presentation = {
  title: 'Untitled Presentation',
  slides: [
    {
      id: uuidv4(),
      background: '#ffffff',
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          x: 100,
          y: 200,
          width: 800,
          height: 100,
          rotation: 0,
          content: 'Welcome to ARADES PRA',
          style: {
            fontSize: '5xl',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#000000',
          },
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 200,
          y: 350,
          width: 600,
          height: 50,
          rotation: 0,
          content: 'A new way to create presentations.',
          style: {
            fontSize: '2xl',
            textAlign: 'center',
            color: '#333333',
          },
        },
      ],
    },
  ],
};

export const SLIDE_ASPECT_RATIO = 16 / 9;
export const SLIDE_WIDTH = 1000;
export const SLIDE_HEIGHT = SLIDE_WIDTH / SLIDE_ASPECT_RATIO;
