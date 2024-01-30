import { githubLogo } from '~/assets';

const OpenInGithub = () => {
  return (
    <a
      href="https://github.com/createapp-ai/figma2app-demo"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center space-x-2 bg-[#02040a] text-white rounded-full px-2 py-[5px] opacity-20 hover:opacity-20 fixed z-100 top-7 right-3 no-underline font-airbnbcereal_w_bk"
    >
      <span className="text-[12px]">Open in</span>
      <img src={githubLogo} alt="GitHub Logo" className="w-3 h-3" />
    </a>
  );
};

export default OpenInGithub;
