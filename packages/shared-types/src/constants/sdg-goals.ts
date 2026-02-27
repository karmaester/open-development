export interface SdgGoal {
  number: number;
  name: string;
  color: string;
  icon: string;
}

export const SDG_GOALS: readonly SdgGoal[] = [
  { number: 1, name: 'No Poverty', color: '#E5243B', icon: 'sdg-1' },
  { number: 2, name: 'Zero Hunger', color: '#DDA63A', icon: 'sdg-2' },
  { number: 3, name: 'Good Health and Well-Being', color: '#4C9F38', icon: 'sdg-3' },
  { number: 4, name: 'Quality Education', color: '#C5192D', icon: 'sdg-4' },
  { number: 5, name: 'Gender Equality', color: '#FF3A21', icon: 'sdg-5' },
  { number: 6, name: 'Clean Water and Sanitation', color: '#26BDE2', icon: 'sdg-6' },
  { number: 7, name: 'Affordable and Clean Energy', color: '#FCC30B', icon: 'sdg-7' },
  { number: 8, name: 'Decent Work and Economic Growth', color: '#A21942', icon: 'sdg-8' },
  { number: 9, name: 'Industry, Innovation and Infrastructure', color: '#FD6925', icon: 'sdg-9' },
  { number: 10, name: 'Reduced Inequalities', color: '#DD1367', icon: 'sdg-10' },
  { number: 11, name: 'Sustainable Cities and Communities', color: '#FD9D24', icon: 'sdg-11' },
  { number: 12, name: 'Responsible Consumption and Production', color: '#BF8B2E', icon: 'sdg-12' },
  { number: 13, name: 'Climate Action', color: '#3F7E44', icon: 'sdg-13' },
  { number: 14, name: 'Life Below Water', color: '#0A97D9', icon: 'sdg-14' },
  { number: 15, name: 'Life on Land', color: '#56C02B', icon: 'sdg-15' },
  { number: 16, name: 'Peace, Justice and Strong Institutions', color: '#00689D', icon: 'sdg-16' },
  { number: 17, name: 'Partnerships for the Goals', color: '#19486A', icon: 'sdg-17' },
] as const;

export const getSdgGoal = (number: number): SdgGoal | undefined =>
  SDG_GOALS.find((g) => g.number === number);
