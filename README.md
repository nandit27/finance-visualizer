# Personal Finance Visualizer

A simple web application for tracking personal finances, built with Next.js, React, shadcn/ui, and Recharts.

## Features

- Add, edit, and delete transactions
- View transaction history
- Visualize monthly expenses with interactive charts
- Responsive design with modern UI components
- Form validation for data entry

## Tech Stack

- **Framework**: Next.js 14
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB (configured, ready for Stage 2)
- **Form Handling**: React Hook Form
- **Validation**: Zod

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd finance-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
finance-visualizer/
├── app/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── lib/
│   │   └── mongodb.ts   # MongoDB configuration
│   ├── models/
│   │   └── Transaction.ts # Data models
│   ├── layout.tsx
│   └── page.tsx
├── public/
└── package.json
```

## Features Implemented (Stage 1)

- [x] Basic transaction tracking
- [x] Transaction list view
- [x] Monthly expenses bar chart
- [x] Form validation
- [x] Responsive design
- [x] Error states

## Future Enhancements (Stage 2+)

- [ ] Categories for transactions
- [ ] Multiple chart types
- [ ] Data export functionality
- [ ] Transaction search and filtering
- [ ] Dark mode support

## Contributing

Feel free to submit issues and enhancement requests.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
