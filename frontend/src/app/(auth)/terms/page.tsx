function Header({ title }: { title: string }) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {title}
    </h2>
  );
}

export default function Terms() {
  return (
    <div className="mx-5 mb-5">
      <h1 className="scroll-m-20 text-center text-4xl tracking-tight text-balance my-5">
        Terms and Conditions
      </h1>

      <Header title={"Introduction"} />
      <p className="leading-7 mt-3 mb-4">
        Welcome to Doro, a grade tracker designed for students at the University
        of Waterloo. By using this service, you agree to comply with and be
        bound by these Terms and Conditions.
      </p>

      <Header title={"Account Creation"} />
      <p className="leading-7 mt-3 mb-4">
        To use Doro, you must sign in with your Google account via OAuth. By
        signing in, you grant Doro access to the basic information associated
        with your Google account, such as your name and email address. Your
        information will not be shared with third parties unless explicitly
        stated.
      </p>

      <Header title={"Use of the Service"} />
      <p className="leading-7 mt-3 mb-4">
        Doro allows you to track your grades for academic courses at the
        University of Waterloo. You are responsible for entering accurate and
        up-to-date information about your courses and grades. Doro does not take
        responsibility for any errors in the data provided by users.
      </p>

      <Header title={"Data Privacy and Security"} />
      <p className="leading-7 mt-3 mb-4">
        We take your privacy seriously. The data you enter into Doro will be
        stored securely. However, by using this service, you acknowledge that no
        system is 100% secure, and while we make reasonable efforts to protect
        your data, we cannot guarantee complete security.
      </p>

      <Header title={"User Responsibilities"} />
      <ul className="my-6 mt-1 ml-6 list-disc [&>li]:mt-2">
        <li>
          You must be at least 18 years old or have parental consent to use this
          service.
        </li>
        <li>
          You agree not to misuse or abuse Doro, including any activity that
          could harm, disrupt, or interfere with the functioning of the service.
        </li>
        <li>
          You are solely responsible for keeping your Google account login
          details secure.
        </li>
      </ul>

      <Header title={"Third-Party Links and Services"} />
      <p className="leading-7 mt-3 mb-4">
        Doro may contain links to third-party websites or services that are not
        controlled or operated by us. We are not responsible for the content,
        privacy policies, or practices of these third-party services.
      </p>

      <Header title={"Limitations of Liability"} />
      <p className="leading-7 mt-3 mb-4">
        Doro is provided "as is" and we do not make any warranties, express or
        implied, about the accuracy, reliability, or availability of the
        service. We are not liable for any damages resulting from the use or
        inability to use Doro.
      </p>

      <Header title={"Changes to Terms"} />
      <p className="leading-7 mt-3 mb-4">
        We reserve the right to update these Terms and Conditions at any time.
        We will notify you of any significant changes via email or through the
        platform. Continued use of the service after such updates will
        constitute your acceptance of the new terms.
      </p>

      <Header title={"Contact"} />
      <p className="leading-7 mt-3 mb-4">
        If you have any questions or concerns about these Terms and Conditions,
        feel free to contact us at{" "}
        <a className="underline" href="mailto:oliadrundassa@gmail.com">
          oliadrundassa@gmail.com
        </a>
        .
      </p>

      <p className="leading-7 mt-3 mb-4">
        By using Doro, you agree to these Terms and Conditions. Thank you for
        using our service!
      </p>
    </div>
  );
}
