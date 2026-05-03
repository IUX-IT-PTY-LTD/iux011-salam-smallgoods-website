import { getTheme, DEFAULT_THEME } from '@/lib/theme';
import DesignEditor from './DesignEditor';

export const metadata = { title: 'Design – Admin' };

export default async function AdminDesignPage() {
  const theme = await getTheme();
  const merged = { ...DEFAULT_THEME, ...theme };
  return <DesignEditor initialTokens={merged} />;
}
