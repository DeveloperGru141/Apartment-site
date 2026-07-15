export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-32 bg-bg-alt">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white p-8 md:p-16">
          <svg
            className="w-10 h-10 text-gray-200 mx-auto mb-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.433.917-3.995 3.638-3.995 5.849h4v10H0z" />
          </svg>
          <blockquote className="font-body font-normal text-base leading-relaxed text-text-body text-xl md:text-2xl text-text-primary mb-10 italic font-light">
            &ldquo;HORIZON transformed our vision of home. The attention to detail
            and personalized service made finding our penthouse an absolute
            pleasure. We couldn&apos;t have imagined a more seamless experience.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <img
              src="https://pbs.twimg.com/profile_images/2011746068594323456/I8madg7A_400x400.jpg"
              alt="Client"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-body font-semibold text-sm tracking-normal text-text-primary">
                Micah Okoh
              </p>
              <p className="font-body font-medium text-sm text-text-body">CEO, Forge Labs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
