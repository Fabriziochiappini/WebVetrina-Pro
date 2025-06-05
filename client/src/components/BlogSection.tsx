import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight, BookOpen } from "lucide-react";
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
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
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
            <BookOpen className="inline-block w-8 h-8 mr-3 text-primary" />
            Blog & Risorse
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Consigli pratici, guide complete e le ultime novità dal mondo del web design e digital marketing
          </p>
        </div>

        {latestPosts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Contenuti in Arrivo
            </h3>
            <p className="text-gray-600 mb-6">
              Stiamo preparando articoli interessanti per te. Torna presto!
            </p>
            <Link href="/blog">
              <Button variant="outline">
                Vai al Blog
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {latestPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {post.featuredImage ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary/60" />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <CalendarDays className="w-4 h-4" />
                      {format(new Date(post.publishedAt || post.createdAt), 'dd MMM yyyy', { locale: it })}
                    </div>
                    
                    <CardTitle className="text-lg font-bold line-clamp-2 hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                    </p>
                    
                    <Link href={`/blog/${post.slug}`}>
                      <div className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm">
                        Leggi tutto
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link href="/blog">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Vedi Tutti gli Articoli
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;