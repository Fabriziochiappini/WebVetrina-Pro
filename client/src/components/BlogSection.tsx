import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, ArrowRight, Sparkles, Eye } from "lucide-react";
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

  const latestPosts = posts?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <section id="blog" className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-pulse"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="h-16 bg-white/10 rounded-2xl mx-auto mb-8 w-96 animate-pulse"></div>
            <div className="h-8 bg-white/5 rounded-xl mx-auto mb-4 w-3/4 animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-pulse">
                <div className="aspect-[16/10] bg-white/10 rounded-2xl mb-6"></div>
                <div className="h-7 bg-white/10 rounded-xl mb-4"></div>
                <div className="h-4 bg-white/5 rounded-lg mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-white/5 rounded w-20"></div>
                  <div className="h-8 bg-white/10 rounded-full w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!latestPosts.length) {
    return (
      <section id="blog" className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 font-heading bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Future Insights
            </h2>
            <p className="text-xl text-gray-300">I nostri primi articoli stanno arrivando presto...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium">Blog & Insights</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 font-heading bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Future Insights
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Esplora le innovazioni digitali e le tendenze che stanno ridefinendo il futuro del web design
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {latestPosts.map((post, index) => (
            <article key={post.id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 group-hover:scale-105"></div>
              
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-white/20">
                <div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  {post.featuredImage ? (
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center">
                      <Eye className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1">
                    <span className="text-white text-xs font-medium">
                      {format(new Date(post.publishedAt || post.createdAt), "d MMM", { locale: it })}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {post.excerpt && (
                    <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(post.publishedAt || post.createdAt), "d MMMM yyyy", { locale: it })}</span>
                    </div>
                    
                    <Link href={`/blog/${post.slug}`}>
                      <button className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                        <span className="font-medium">Leggi</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/blog">
            <button className="group inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-2xl transition-all duration-500 hover:scale-105 hover:border-white/30">
              <span className="text-lg font-medium">Scopri tutti gli articoli</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;