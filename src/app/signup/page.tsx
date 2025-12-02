import { redirect } from 'next/navigation';

export default function Signup() {
  // Redirect to Clerk's sign-up page
  redirect('/sign-up');
}
