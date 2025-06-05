import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, Sparkles, Eye, Search, TrendingUp, Zap } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useState } from "react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts?status=published');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    }
  });

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-pulse"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center mb-20">
            <div className="h-16 bg-white/10 rounded-2xl mx-auto mb-8 w-96 animate-pulse"></div>
            <div className="h-8 bg-white/5 rounded-xl mx-auto mb-4 w-3/4 animate-pulse"></div>
            <div className="h-6 bg-white/5 rounded-lg mx-auto w-1/2 animate-pulse"></div>
          </div>
          
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-pulse">
              <div className="aspect-video bg-white/10 rounded-2xl mb-8"></div>
              <div className="h-8 bg-white/10 rounded-xl mb-4 w-3/4"></div>
              <div className="h-6 bg-white/5 rounded-lg mb-6 w-full"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-white/5 rounded w-32"></div>
                <div className="h-10 bg-white/10 rounded-full w-32"></div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 animate-pulse">
                <div className="aspect-video bg-white/10 rounded-2xl mb-6"></div>
                <div className="h-6 bg-white/10 rounded-xl mb-3 w-3/4"></div>
                <div className="h-4 bg-white/5 rounded mb-2"></div>
                <div className="h-4 bg-white/5 rounded mb-4 w-2/3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-white/5 rounded w-20"></div>
                  <div className="h-8 bg-white/10 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 animate-pulse"></div>
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-8 py-3 mb-8">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium text-lg">Digital Innovation Hub</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 font-heading bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Blog Futuristico
          </h1>
          
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Immergiti nel futuro del web design. Scopri le tendenze rivoluzionarie, le tecnologie emergenti e le strategie innovative che stanno trasformando il panorama digitale.
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
              <div className="flex items-center gap-4">
                <Search className="w-6 h-6 text-purple-400 ml-4" />
                <input
                  type="text"
                  placeholder="Cerca articoli del futuro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 border-none outline-none text-lg py-3"
                />
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium">
                  Cerca
                </button>
              </div>
            </div>
          </div>
        </div>

        {featuredPost && (
          <div className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 font-medium">Articolo in Evidenza</span>
              </div>
            </div>
            
            <article className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
              
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 transition-all duration-500 group-hover:scale-[1.01] group-hover:border-white/30">
                <div className="aspect-[21/9] relative overflow-hidden bg-gradient-to-br from-purple-600/30 to-blue-600/30">
                  {featuredPost.featuredImage ? (
                    <img 
                      src={featuredPost.featuredImage} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center">
                      <Eye className="w-20 h-20 text-white/60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  <div className="absolute top-6 left-6 flex gap-3">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Featured
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {format(new Date(featuredPost.publishedAt || featuredPost.createdAt), "d MMM yyyy", { locale: it })}
                    </span>
                  </div>
                </div>
                
                <div className="p-10">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 group-hover:text-purple-200 transition-colors duration-300 leading-tight">
                    {featuredPost.title}
                  </h2>
                  
                  {featuredPost.excerpt && (
                    <p className="text-xl text-gray-300 mb-8 line-clamp-3 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar className="w-5 h-5" />
                      <span className="text-lg">{format(new Date(featuredPost.publishedAt || featuredPost.createdAt), "d MMMM yyyy", { locale: it })}</span>
                      <Clock className="w-5 h-5 ml-4" />
                      <span className="text-lg">5 min di lettura</span>
                    </div>
                    
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <button className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 text-lg font-medium">
                        <span>Leggi l'Articolo</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}

        {remainingPosts.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Tutti gli Articoli
              </h2>
              <p className="text-gray-400 text-lg">
                {remainingPosts.length} articol{remainingPosts.length === 1 ? 'o' : 'i'} trovat{remainingPosts.length === 1 ? 'o' : 'i'}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingPosts.map((post, index) => (
                <article key={post.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-white/20">
                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
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
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(post.publishedAt || post.createdAt), "d MMM yyyy", { locale: it })}</span>
                        </div>
                        
                        <Link href={`/blog/${post.slug}`}>
                          <button className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium">
                            <span>Leggi</span>
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {filteredPosts.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="mb-8">
              <Search className="w-20 h-20 text-gray-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">Nessun articolo trovato</h3>
              <p className="text-gray-400 text-lg">
                {searchTerm ? 
                  `Nessun risultato per "${searchTerm}". Prova con altri termini di ricerca.` :
                  "I nostri primi articoli stanno arrivando presto..."
                }
              </p>
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
              >
                Mostra tutti gli articoli
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}