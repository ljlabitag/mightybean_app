import Jumbotron from "../components/general/jumbotron"

const bgImage = {
  backgroundImage: 'url("/flat-lay-cups-coffee-beans.jpg")',
  backgroundSize: 'cover'
};

export default function Home() {

  return (
  <main className='flex min-h-[560px]' style={bgImage}>
    <div className='basis-1/2 p-24'>
      <Jumbotron/>
    </div>
  </main>
);
}