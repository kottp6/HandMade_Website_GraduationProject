import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../Newsletter/Newsletter';
import Navbar from '../Navbar/Navbar';



const Journal = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const handmadeImages = [
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_9_da74b2c4-111f-4fe4-8474-fa90603be60a_533x.jpg?v=1751439813",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/katsia-jazwinska-rSaWiL0SxSM-unsplash_1_cbe65ec8-68ea-4159-b538-0a8c1ff81219_533x.jpg?v=1665069977",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_12_392d9c41-32f6-4b69-a459-e1c6c5be3d36_533x.jpg?v=1751439833",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_10_533x.jpg?v=1665069931",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_3_214344b7-6c32-49c7-9607-fb7b33ea82eb_533x.jpg?v=1751439852",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_5_533x.jpg?v=1665068546",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_2_aaa3b2d5-9e6e-45a9-9676-226997f29008_533x.jpg?v=1665068515",
    "https://handmade-demo.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_1_b17b7ca7-33a3-4fdc-bf1f-7d98d9c625f1_533x.jpg?v=1665067924",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_533x.jpg?v=1665068480",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_4_533x.jpg?v=1665068465"
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('https://dummyjson.com/posts?limit=10');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();

       
        const postsWithImages = data.posts.map((post, idx) => ({
          ...post,
          image: handmadeImages[idx % handmadeImages.length],
        }));

        setPosts(postsWithImages);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const featured = posts[0];
  const sidebarPosts = posts.slice(1, 4);
  const gridPosts = posts.slice(4);

  return (
    <>
      <Navbar />
      <div className="bg-[#F5F5F1] text-[#A78074] font-sans">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-12">
            <Link to="/" className="flex items-center text-[#A78074] hover:text-[#7e5d4c] transition">
              <span className="text-xl">←</span>
              <span className="ml-1 text-sm font-medium">Home</span>
            </Link>
          </div>

          <h1 className="text-5xl font-[Playfair_Display] mb-12">Journal</h1>

          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && featured && (
            <div className="grid lg:grid-cols-3 gap-8 mb-20">
              <Link
                to={`/journal/${featured.id}`}
                className="relative rounded-xl overflow-hidden border border-[#e0deda] shadow transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:border-[#A78074] group lg:col-span-2"
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white p-6">
                  <h2 className="text-3xl font-[Playfair_Display] font-semibold group-hover:underline leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-sm mt-1 text-gray-300 italic">October 01, 2023 — by Jane Smith</p>
                  <span className="mt-3 inline-block text-sm underline">Read More →</span>
                </div>
              </Link>

              <div className="flex flex-col gap-6">
                {sidebarPosts.map((post) => (
                  <Link
                    to={`/journal/${post.id}`}
                    key={post.id}
                    className="flex items-start gap-4 border-b border-[#e0deda] pb-4 transition-all duration-300 ease-in-out hover:pl-1 hover:border-[#A78074]"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-24 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-md font-semibold leading-tight mb-1 font-[Playfair_Display]">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500">October 01, 2023 — Jane Smith</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid md:grid-cols-3 gap-8 mb-24">
              {gridPosts.map((post) => (
                <Link
                  to={`/journal/${post.id}`}
                  key={post.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#A78074] transform transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-[#eaeaea] group"
                >
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-gray-400 mb-1">October 01, 2023</p>
                    <h4 className="text-xl font-[Playfair_Display] font-medium text-[#4b3832] group-hover:underline mb-2 leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-sm text-[#7e6b64] line-clamp-3">{post.body}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Newsletter />

        {/* Instagram Section */}
        <div className="bg-[#faf8f6] w-full py-20 px-4 text-center">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="hidden lg:flex flex-col gap-4">
              <img src="https://handmade-demo.myshopify.com/cdn/shop/files/Mask_group-3_300x.jpg?v=1663336955" alt="left1" className="w-24 h-32 object-cover rounded" />
              <img src="https://handmade-demo.myshopify.com/cdn/shop/files/Mask_group-2_350x.jpg?v=1663337062" alt="left2" className="w-24  ml-16 h-24 object-cover rounded" />
            </div>

            <div className="text-center max-w-lg mx-auto">
              <p className="uppercase text-[10px] tracking-[2px] text-gray-500 mb-2">Instagram</p>
              <h2 className="text-[28px] font-[Playfair_Display] text-[#a78074] mb-6">Follow Us on Instagram</h2>

              <div className="flex items-center justify-center gap-4 mb-4">
                <img
                  src="https://handmade-demo-decor.myshopify.com/cdn/shop/files/mathilde-langevin-TJ6eg8okyNs-unsplash_3_130x.jpg?v=1663738803"
                  alt="avatar"
                  className="rounded-full w-16 h-16 object-cover"
                />
                <div className="text-left">
                  <p className="text-[#a78074] font-semibold">@handmade_studio</p>
                  <p className="text-sm text-gray-500">16k Followers</p>
                </div>
              </div>

              <a
                href="https://instagram.com/handmade_studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 border border-[#a78074] text-[#a78074] hover:bg-[#a78074] hover:text-white transition duration-300 rounded"
              >
                Follow on Instagram →
              </a>
            </div>

            <div className="hidden lg:flex flex-col gap-4">
              <img src="https://handmade-demo.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_3_fec091af-2495-46b2-be58-eaca2f0ea602_533x.jpg?v=1751615977" alt="right1" className="w-24 h-24 object-cover rounded" />
              <img src="https://handmade-demo.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_1_179a7722-e002-4a8e-98dc-e62890f3a34d_533x.jpg?v=1751615934" alt="right2" className="w-24 h-32 ml-12 object-cover rounded" />
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Journal;
