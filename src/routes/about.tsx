import { createFileRoute } from '@tanstack/react-router';
import MyForm from '@/components/tesform';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <MyForm />
    </div>
  );
}
