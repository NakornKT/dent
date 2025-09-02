import React from 'react';

const MapSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Our Location</h2>
      <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.80117416251!2d98.95460167560839!3d18.807012060361068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3b9225a6af11%3A0x32c45a2c024a18a!2zVG9vdGggU21pbGUgUGx1cyBEZW50YWwgY2xpbmljIOC4hOC4peC4tOC4meC4tOC4geC4l-C4seC4meC4leC4geC4o-C4o-C4oeC4l-C4ueC4mOC4quC5hOC4oeC4peC5jOC4nuC4peC4seC4qiDguJfguLPguJ_guLHguJkg4LiI4Lix4LiU4Lif4Lix4LiZIOC4q-C4meC5ieC4suC4oeC4ii4g4Lif4Lit4LiB4Liq4Li14Lif4Lix4LiZ4LiC4Liy4LinIOC4o-C4suC4geC5gOC4l-C4teC4ouC4oQ!5e0!3m2!1sth!2sth!4v1755962649374!5m2!1sth!2sth"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <p className="text-center text-gray-600 mt-4"> </p>
    </section>
  );
};

export default MapSection;