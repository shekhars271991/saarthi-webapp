import Header from './components/Header';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Homepage from './components/HomePage';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Homepage/>
      <Footer />
    </div>
  );
}