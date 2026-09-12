type FlashBannerProps = {
  message: string;
};

export function FlashBanner({ message }: FlashBannerProps): React.ReactElement {
  return (
    <div
      role="status"
      className="rounded-2xl border border-leaf/30 bg-leaf/10 px-4 py-3 text-sm text-forest"
    >
      {message}
    </div>
  );
}
