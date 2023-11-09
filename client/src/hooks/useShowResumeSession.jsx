import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import { findSessionWithUid } from "../services/collaborationService";

/**
 * Checks if user has an active session that wasn't ended intentionally.
 * This hook runs on all pages except the `session` page.
 *
 * @returns {boolean} True if user has `roomId` in localStorage
 */
const useHasActiveSession = () => {
  const { pathname } = useLocation();
  const [hasActiveSession, setHasActiveSession] = useState(false);

  useEffect(() => {
    // Don't run this on the session page
    if (pathname.search("/session") === 0) return;

    // Search for existing session
    // const userData = localStorage.getItem("user");
    // const userObject = JSON.parse(userData);
    // const uid = userObject.uid;
    // const roomId = await findSessionWithUid(uid);
    if (roomId) {
      localStorage.setItem("roomId", roomId);
    }

    const hasActiveSession = localStorage.getItem("roomId");
    if (hasActiveSession) {
      setHasActiveSession(true);
    }
  }, []);

  return hasActiveSession;
};

export default useHasActiveSession;
