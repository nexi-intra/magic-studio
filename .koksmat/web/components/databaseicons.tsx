/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aBJ2IQGx9R6
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center">
          <DatabaseIcon className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-sm font-medium">Database</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="bg-secondary w-12 h-12 rounded-lg flex items-center justify-center">
          <TableIcon className="w-6 h-6 text-secondary-foreground" />
        </div>
        <span className="text-sm font-medium">Tables</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center">
          <ListIcon className="w-6 h-6 text-accent-foreground" />
        </div>
        <span className="text-sm font-medium">Items</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="bg-muted w-12 h-12 rounded-lg flex items-center justify-center">
          <ViewIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium">Views</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="bg-card w-12 h-12 rounded-lg flex items-center justify-center">
          <CommandIcon className="w-6 h-6 text-card-foreground" />
        </div>
        <span className="text-sm font-medium">Procedures</span>
      </div>
    </div>
  );
}

function CommandIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
    </svg>
  );
}

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function ListIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function TableIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </svg>
  );
}

function ViewIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
      <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
