"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getProfile } from "@/lib/api/demo";
import type { UserProfile } from "@/lib/types";

export function ProfilePanel() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const data = await getProfile();
        if (isMounted) setProfile(data);
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Ошибка загрузки профиля.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card>
      <div className="stack-sm">
        <h3>Профиль</h3>
        {loading ? <p>Загрузка профиля...</p> : null}
        {error ? <p className="field-error">{error}</p> : null}

        {profile ? (
          <>
            <p><strong>Имя:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Роль:</strong> {profile.role}</p>
            <p><strong>О себе:</strong> {profile.bio}</p>
          </>
        ) : null}
      </div>
    </Card>
  );
}
