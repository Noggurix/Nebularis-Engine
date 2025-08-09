export type CelestialBody = {
  name: string;
  type: 'planet' | 'star' | 'moon' | 'ring';
  size?: number;
  distance?: number;
  period?: number;
  texture: string;
  innerRadius?: number;
  outerRadius?: number;
  thetaSegments?: number;
};

export type BodiesProperties = {
  planetScaleFactor: number;
  celestialBodiesProperties: CelestialBody[];
};