import { useState, useCallback, useEffect, useRef } from "react";
import * as adminService from "../services/admin.service";

export function useAdminData(showToast) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await adminService.getStats();
      setStats(res.data);
    } catch {
      showToastRef.current("Error al cargar estadísticas", "error");
    } finally {
      setLoadingStats(false);
    }
  }, []); 

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch {
      showToastRef.current("Error al cargar usuarios", "error");
    } finally {
      setLoadingUsers(false);
    }
  }, []); 

  const fetchPosts = useCallback(async () => {
    try {
      setLoadingPosts(true);
      const res = await adminService.getRecentPosts();
      setPosts(res.data);
    } catch {
      showToastRef.current("Error al cargar publicaciones", "error");
    } finally {
      setLoadingPosts(false);
    }
  }, []); 

  const fetchComments = useCallback(async () => {
    try {
      setLoadingComments(true);
      const res = await adminService.getRecentComments();
      setComments(res.data);
    } catch {
      showToastRef.current("Error al cargar comentarios", "error");
    } finally {
      setLoadingComments(false);
    }
  }, []); 

  const refetchAll = useCallback(() => {
    fetchStats();
    fetchUsers();
    fetchPosts();
    fetchComments();
  }, [fetchStats, fetchUsers, fetchPosts, fetchComments]);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]); 

  return {
    stats,
    users,
    posts,
    comments,
    loadingStats,
    loadingUsers,
    loadingPosts,
    loadingComments,
    fetchStats,
    fetchUsers,
    fetchPosts,
    fetchComments,
    refetchAll,
  };
}
