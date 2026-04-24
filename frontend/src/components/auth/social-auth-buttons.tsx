import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function SocialAuthButtons() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          или
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="grid gap-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/api/auth/oauth/google/redirect">
            Продолжить через Google
          </Link>
        </Button>

        <Button asChild variant="outline" className="w-full">
          <Link href="/api/auth/oauth/yandex/redirect">
            Продолжить через Яндекс
          </Link>
        </Button>
      </div>
    </div>
  );
}