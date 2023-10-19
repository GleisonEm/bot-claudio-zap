/**
 * Demo CLI for testing conversation support.
 *
 * ```
 * npx ts-node demos/demo-conversation.ts
 * ```
 */

async function main() {
    const { BingChat } = await import('bing-chat');
    const api = new BingChat({ cookie: '1-c1sdaAI-OQ771WAdy0pWtBJWQm0-w429__6D6AjB7A73icjuX4D4dXe4TwEVUBYpVSlBWXdiQNCoduZE7eYSiHF2pYQHJtWo05kyRRBA9kQoxwXSgFHfbe1fWPyzCMBqDuCODxxvJ_q07F2mBTgzAw-Zx-hn2u5qM0ZH0BucuKtF78DmpZNUbyWkpfxNvQSqF-rp4ZjVSQfEzBqjxI9e-Kud2RTnv2E5kJR1LqxE8o' });

    const prompts = [
        'Write a poem about cats.',
        'Can you make it cuter and shorter?',
        'Now write it in French.',
        'What were we talking about again?',
    ];

    let res = null;
    res = await api.sendMessage(prompts[0]);
    console.log(res)
    console.log('\n' + res.text + '\n');
    // for (const prompt of prompts) {
    //     res = await api.sendMessage(prompt, res);
    //     console.log('\n' + res.text + '\n');
    // }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
