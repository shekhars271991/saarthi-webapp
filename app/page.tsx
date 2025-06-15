import Header from './components/Header';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <FAQ />
      <Footer />
    </div>
  );
}