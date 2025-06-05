import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, ArrowRight, Search } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Header skeleton */}
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded mx-auto mb-4 w-64 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto w-96 animate-pulse"></div>
          </div>
          
          {/* Search skeleton */}
          <div className="max-w-md mx-auto mb-12">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Grid skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">
            Blog & Risorse
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Approfondimenti, guide e novità dal mondo del web design e dello sviluppo digitale
          </p>
        </div>
        
        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cerca articoli..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
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
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
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
        ) : (
          <div className="text-center py-16">
            <div className="mb-8">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm ? "Nessun articolo trovato" : "Nessun articolo disponibile"}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 
                  `Nessun risultato per "${searchTerm}". Prova con altri termini di ricerca.` :
                  "I nostri primi articoli stanno arrivando presto..."
                }
              </p>
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-300 font-medium"
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