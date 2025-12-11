function Header({ title }: { title: string }) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {title}
    </h2>
  );
}

export default function Privacy() {
  return (
    <div className="mx-5 mb-5">
      <h1 className="scroll-m-20 text-center text-4xl tracking-tight text-balance my-5">
        Privacy Policy
      </h1>

      <Header title={"Introduction"} />
      <p className="leading-7 mt-3 mb-4">
        Welcome to Doro, a grade tracker designed for students at the University
        of Waterloo. We value your privacy and are committed to protecting your
        personal information. This Privacy Policy outlines the types of
        information we collect, how we use it, and how we protect it.
      </p>

      <Header title={"Information We Collect"} />
      <p className="leading-7 mt-3 mb-4">
        When you sign in to Doro, we collect basic information from your Google
        account, such as your name and email address, through the Google OAuth
        process. This information is used to provide you with personalized
        features on the platform.
      </p>

      <Header title={"How We Use Your Information"} />
      <p className="leading-7 mt-3 mb-4">
        We use the information we collect to:
        <ul className="my-6 mt-1 ml-6 list-disc [&>li]:mt-2">
          <li>Allow you to sign in and use Doro’s features.</li>
          <li>
            Track your academic performance and display relevant information on
            your dashboard.
          </li>
        </ul>
      </p>

      <Header title={"Data Storage and Security"} />
      <p className="leading-7 mt-3 mb-4">
        Your data is stored securely and we take appropriate measures to protect
        it. However, please note that no system can be completely secure, and we
        cannot guarantee full protection against unauthorized access or misuse
        of your data.
      </p>

      <Header title={"Sharing Your Information"} />
      <p className="leading-7 mt-3 mb-4">
        We do not share your personal information with third parties unless
        explicitly required by law or with your consent. The information you
        provide is used solely for the purpose of offering Doro’s features.
      </p>

      <Header title={"Cookies and Tracking"} />
      <p className="leading-7 mt-3 mb-4">
        Doro uses cookies or similar technologies to improve user experience and
        analyze platform usage. These cookies may collect non-personal
        information about your browsing activities. You can control cookies
        through your browser settings.
      </p>

      <Header title={"Your Rights"} />
      <p className="leading-7 mt-3 mb-4">
        You have the right to access, update, or delete the personal information
        we hold about you. To request a copy of your information or request
        deletion, please contact us at the email provided below.
      </p>

      <Header title={"Third-Party Services"} />
      <p className="leading-7 mt-3 mb-4">
        Doro may contain links to third-party websites and services. These
        external services have their own privacy policies, and we are not
        responsible for their content or privacy practices.
      </p>

      <Header title={"Changes to Privacy Policy"} />
      <p className="leading-7 mt-3 mb-4">
        We reserve the right to modify this Privacy Policy at any time. Any
        significant changes will be communicated to you via email or through the
        platform. Continued use of Doro after such changes constitutes your
        acceptance of the updated policy.
      </p>

      <Header title={"Contact Us"} />
      <p className="leading-7 mt-3 mb-4">
        If you have any questions or concerns regarding this Privacy Policy,
        please feel free to contact us at{" "}
        <a className="underline" href="mailto:oliadrundassa@gmail.com">
          oliadrundassa@gmail.com
        </a>
        .
      </p>

      <p className="leading-7 mt-3 mb-4">
        By using Doro, you agree to the terms outlined in this Privacy Policy.
        Thank you for trusting us with your information!
      </p>
    </div>
  );
}
