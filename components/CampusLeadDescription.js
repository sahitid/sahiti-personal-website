export default function CampusLeadDescription({ text }) {
  const links = {
    Cursor: { href: 'https://cursor.com/community', icon: '/cursor.ico' },
    'Grok Bot': { href: 'https://x.ai/bot', icon: '/grok.svg' },
  };
  return <>{text.split(/(Cursor|Grok Bot)/g).map((part, index) => links[part] ? <a key={index} href={links[part].href} target="_blank" rel="noopener noreferrer" className="cursor-community-link"><img src={links[part].icon} width="12" height="12" alt="" />{part}</a> : part)}</>;
}
