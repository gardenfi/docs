import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.
 
 Create as many sidebars as you want.
 */

const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{ type: "autogenerated", dirName: "." }],

  home: [
    { type: 'doc', label: 'Get Started', id: 'home/get-started' },
    {
      type: 'category',
      label: 'Fundamentals',
      collapsible: false,

      items: [
        {
          type: 'category',
          label: 'Introduction',
          link: { type: 'doc', id: 'home/fundamentals/introduction/introduction' },
          items: [
            'home/fundamentals/introduction/intents',
            'home/fundamentals/introduction/solvers',
            'home/fundamentals/introduction/stakers',
            'home/fundamentals/introduction/auctions',
            'home/fundamentals/introduction/atomic-swaps',
          ],
        },
        {
          type: 'category',
          label: 'How it works',
          link: { type: 'doc', id: 'home/fundamentals/how-it-works/how-it-works' },
          items: [
            'home/fundamentals/how-it-works/intent-flow',
            'home/fundamentals/how-it-works/cross-chain-coincidence-of-wants-xcow',
          ],
        },
        {
          type: 'category',
          label: 'Benefits',
          link: { type: 'doc', id: 'home/fundamentals/benefits/benefits' },
          items: [
            'home/fundamentals/benefits/cross-chain-intents',
            'home/fundamentals/benefits/free-option-protection',
            'home/fundamentals/benefits/better-price',
            'home/fundamentals/benefits/no-custody-risk',
          ],
        },
        {
          type: 'category',
          label: 'Guides',
          collapsible: false,

          items: [
            {
              type: 'category',
              label: 'Swap',
              link: { type: 'doc', id: 'home/basics/guides/swap/swap' },

              items: [
                'home/basics/guides/swap/btc-wbtc',
                'home/basics/guides/swap/wbtc-btc',
                'home/basics/guides/swap/wbtc-wbtc',
                'home/basics/guides/swap/btc-ibtc',
                'home/basics/guides/swap/ibtc-btc',
                'home/basics/guides/swap/btc-swbtc',
                'home/basics/guides/swap/swbtc-btc',
              ],
            },
            {
              type: 'category',
              label: 'Stake',
              link: { type: 'doc', id: 'home/basics/guides/stake/stake-seed' },

              items: []
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Governance',
      collapsible: false,

      items: [
        'home/governance/tokenomics',
        'home/governance/governance-process',
        'home/governance/snapshot',
      ]
    },
  ],

  developers: [
    'developers/developers',
    {
      type: 'category',
      label: 'Garden SDK',
      link: { type: 'doc', id: 'developers/sdk/sdk' },
      items: [
        {
          type: 'category',
          label: 'React hooks (recommended)',
          link: {
            type: 'doc',
            id: 'developers/sdk/react-hooks/installation',
          },
          items: [
            'developers/sdk/react-hooks/installation',
            'developers/sdk/react-hooks/quickstart',
            'developers/sdk/react-hooks/usegarden-hook',
            'developers/sdk/react-hooks/swap-and-initiate',
            'developers/sdk/react-hooks/auto-redeems',
          ],
        },
        'developers/sdk/installation',
        'developers/sdk/configure-sdk',
        'developers/sdk/quote',
        'developers/sdk/swap-and-initiate',
        'developers/sdk/redeems-and-refunds',
        'developers/sdk/get-transactions',
      ],
    },

    {
      type: 'category',
      label: 'Testing in localnet',
      link: { type: 'doc', id: 'developers/merry/testing-in-localnet' },
      items: ['developers/merry/merry', 'developers/merry/merry-cmds', 'developers/merry/merry-services'],
    },
    // {
    //   type: 'category',
    //   label: 'Cookbook',
    //   link: { type: 'doc', id: 'developers/cookbook/cookbook' },
    //   items: [],
    // },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
