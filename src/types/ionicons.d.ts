declare namespace JSX {
  interface IntrinsicElements {
    'ion-icon': {
      name: string;
      size?: 'small' | 'large' | string;
      style?: React.CSSProperties;
      className?: string;
    };
  }
}