import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { ArrowLeft, CalendarDays, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

const BlogPost = () => {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog/posts/slug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Articolo non trovato');
        }
        throw new Error('Errore nel caricamento dell\'articolo');
      }
      return response.json();
    },
    enabled: !!slug
  });

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Caricamento articolo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {error?.message || 'Articolo non trovato'}
            </h1>
            <p className="text-gray-600 mb-8">
              L'articolo che stai cercando non esiste o è stato rimosso.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna al Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Update page title and meta description
  if (typeof document !== 'undefined') {
    document.title = post.metaTitle || `${post.title} | WebProItalia Blog`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && post.metaDescription) {
      metaDescription.setAttribute('content', post.metaDescription);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/blog">
            <Button variant="ghost" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Torna al Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="aspect-video md:aspect-[21/9] overflow-hidden bg-gray-200">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  <span>
                    {format(new Date(post.publishedAt || post.createdAt), 'dd MMMM yyyy', { locale: it })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>WebProItalia</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Condividi
                </Button>
              </div>

              {post.excerpt && (
                <div className="text-xl text-gray-700 leading-relaxed border-l-4 border-primary pl-6 italic">
                  {post.excerpt}
                </div>
              )}
            </header>

            {/* Article Body */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-gray-900 prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Hai bisogno di un sito web professionale?
                </h3>
                <p className="text-gray-700 mb-4">
                  Contattaci per una consulenza gratuita e scopri come possiamo aiutarti a crescere online.
                </p>
                <Link href="/#contatti">
                  <Button className="bg-secondary hover:bg-secondary/90">
                    Contattaci Ora
                  </Button>
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;