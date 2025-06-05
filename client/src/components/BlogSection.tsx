import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: "draft" | "published";
  createdAt: string;
  publishedAt?: string;
}

const BlogSection = () => {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts?status=published');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    }
  });

  // Show only latest 3 posts
  const latestPosts = posts?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <section id="blog" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Blog & Risorse
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Consigli, guide e novità dal mondo del web design
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!latestPosts.length) {
    return (
      <section id="blog" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Blog & Risorse
            </h2>
            <p className="text-xl text-gray-600">I nostri primi articoli stanno arrivando presto...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
            Blog & Risorse
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Consigli, guide e novità dal mondo del web design
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {latestPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {post.featuredImage ? (
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">Blog Post</span>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{format(new Date(post.publishedAt || post.createdAt), "d MMMM yyyy", { locale: it })}</span>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`}>
                    <button className="inline-flex items-center text-primary hover:text-primary-dark font-medium">
                      <span>Leggi tutto</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* View all button */}
        <div className="text-center">
          <Link href="/blog">
            <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-300 font-medium">
              Visualizza tutti gli articoli
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;