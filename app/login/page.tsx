// import { sendMagicLink } from './actions';
import { redirect } from 'next/navigation';

// export default function LoginPage({}: // searchParams,
// {
// searchParams?: { sent?: string; error?: string };
// }) {
// const sent = searchParams?.sent === '1';
export default function LoginPage() {
  redirect('/'); // temporary: send everyone to home
  //   const sent = false;
  //   return (
  //     <main
  //       className="
  //         min-h-[calc(100vh-4rem)]
  //         flex items-center justify-center px-4
  //         bg-background text-foreground
  //       "
  //     >
  //       <div
  //         className="
  //   w-full max-w-md rounded-2xl border border-border p-7 shadow-lg
  //   bg-card text-card-foreground backdrop-blur-sm
  // "
  //       >
  //         <header className="mb-6 text-center">
  //           <h1 className="text-2xl font-semibold tracking-tight">
  //             Connect Four
  //           </h1>
  //           <p className="mt-1 text-sm text-muted-foreground">
  //             Sign in to save games & track wins
  //           </p>
  //         </header>

  //         {sent ? (
  //           <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3 text-sm text-muted-foreground">
  //             Check your email for a sign-in link. You can close this tab.
  //           </div>
  //         ) : (
  //           <form className="space-y-5">
  //             <div className="space-y-2">
  //               <label htmlFor="email" className="block text-sm font-medium">
  //                 Email
  //               </label>
  //               <input
  //                 id="email"
  //                 name="email"
  //                 type="email"
  //                 required
  //                 autoComplete="email"
  //                 placeholder="you@example.com"
  //                 className="block w-full rounded-xl bg-background text-foreground px-3 py-2 text-[15px]
  //                            border border-[color:var(--border)] shadow-sm outline-none transition
  //                            placeholder:text-muted-foreground
  //                            focus:ring-4 focus:ring-[color:var(--ring)] dark:bg-neutral-900"
  //               />
  //             </div>

  //             <button
  //               formAction={sendMagicLink}
  //               className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white
  //                          shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]
  //                          disabled:opacity-60"
  //             >
  //               Send magic link
  //             </button>
  //           </form>
  //         )}
  //       </div>
  //     </main>
  // );
}
