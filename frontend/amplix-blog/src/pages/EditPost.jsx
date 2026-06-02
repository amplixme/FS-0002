import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getPostById, updatePost } from "../services/post.service";
import PostForm from "../components/common/PostForm";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await getPostById(id)
        const post = result.data ? result.data : result

        if(user.id !== post.authorId) {
          navigate("/")
          return
        }

        setTitle(post.title)
        setContent(post.content)
        setPublished(post.published)
        if (post.imageUrl) setImagePreview(post.imageUrl)
      } catch (error) {
        setError(error.message || "error al cargar el articulo")
      }finally {
        setFetching(false)
      } 
    }

    fetchPost()
  },[id])

    const handleImageChange =  (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  const handleSubmit = async(e) => {
    e.preventDefault 
    setError("")
    setLoading(true)

    try {
      await updatePost(id, {title, content, published})
      navigate(`/posts/${id}`);
    } catch (error) {
      setError(error.message || "Error al actualizar un articulo")
    }finally{
      setLoading(false)
    }
  }

 if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  return ( <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-3xl mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl ambient-shadow overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary-container"></div>
          <div className="p-8 sm:p-10">
            <header className="mb-8 border-b border-outline-variant/30 pb-6">
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
                Editar Artículo
              </h1>
              <p className="text-on-surface-variant mt-2">
                Modificá el contenido de tu artículo.
              </p>
            </header>

            <PostForm
              title={title} setTitle={setTitle}
              content={content} setContent={setContent}
              published={published} setPublished={setPublished}
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              submitLabel="Guardar Cambios"
              onCancel={() => navigate(`/posts/${id}`)}
            />
          </div>
        </div>
      </main>
    </div>)
};

export default EditPost;
