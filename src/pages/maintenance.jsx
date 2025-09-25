import Head from 'next/head';

export default function Maintenance() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Full viewport height
        textAlign: 'center', // Ensure text is centered
        fontFamily: 'Arial, sans-serif', // Clean font
      }}
    >
      <Head>
        <title>Under Maintenance</title>
        <meta name="robots" content="noindex" />
      </Head>
      <h1
        style={{
          fontSize: '2.5rem', // Larger heading
          marginBottom: '1rem', // Space below heading
        }}
      >
        Site Under Maintenance
      </h1>
      <p
        style={{
          fontSize: '1.2rem', // Slightly larger text
          maxWidth: '600px', // Limit width for readability
          padding: '0 1rem', // Padding for mobile
        }}
      >
        We will be back soon!
      </p>
    </div>
  );
}