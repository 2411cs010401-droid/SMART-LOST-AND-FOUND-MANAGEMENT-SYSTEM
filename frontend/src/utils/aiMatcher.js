import Fuse from 'fuse.js';

const GENERIC_WORDS = new Set([
    'key', 'keys', 'watch', 'wallet', 'bag', 'bags', 'phone', 'mobile',
    'laptop', 'book', 'books', 'document', 'documents', 'item', 'lost',
    'found', 'cycle', 'bicycle', 'bike', 'bikes'
]);

const normalize = (value = '') =>
    String(value).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

const words = (value = '') => normalize(value).split(' ').filter(Boolean);

const distinctWords = (value = '') => words(value).filter(word => word.length > 2 && !GENERIC_WORDS.has(word));

const overlapRatio = (leftWords, rightWords) => {
    if (!leftWords.length || !rightWords.length) return 0;
    const rightSet = new Set(rightWords);
    const matches = leftWords.filter(word => rightSet.has(word)).length;
    return matches / Math.max(leftWords.length, rightWords.length);
};

const fuseSimilarity = (left = '', right = '') => {
    const leftText = normalize(left);
    const rightText = normalize(right);
    if (!leftText || !rightText) return 0;
    if (leftText === rightText) return 1;

    const fuse = new Fuse([{ value: rightText }], {
        keys: ['value'],
        includeScore: true,
        threshold: 0.6,
        ignoreLocation: true
    });
    const result = fuse.search(leftText)[0];
    return result ? Math.max(0, 1 - result.score) : 0;
};

export const calculateAiMatch = (lostItem, foundItem) => {
    const sameCategory = lostItem.category === foundItem.category;
    const lostName = normalize(lostItem.name);
    const foundName = normalize(foundItem.name);
    const lostDistinct = distinctWords(lostItem.name);
    const foundDistinct = distinctWords(foundItem.name);
    const distinctOverlap = overlapRatio(lostDistinct, foundDistinct);
    const locationOverlap = overlapRatio(words(lostItem.location), words(foundItem.location));
    const brandOverlap = normalize(lostItem.brand) && normalize(lostItem.brand) === normalize(foundItem.brand) ? 1 : 0;
    const exactName = lostName && lostName === foundName;

    const fuzzyName = fuseSimilarity(lostItem.name, foundItem.name);
    const nameScore = exactName
        ? 40
        : distinctOverlap > 0
            ? Math.round(25 + (15 * Math.max(distinctOverlap, fuzzyName)))
            : 0;

    const score =
        nameScore +
        (sameCategory ? 15 : 0) +
        Math.round(locationOverlap * 25) +
        (brandOverlap ? 15 : 0) +
        (distinctOverlap > 0 ? 5 : 0);

    return {
        score: Math.min(100, score),
        isMatch: sameCategory && score >= 70,
        reasons: {
            name: nameScore,
            category: sameCategory ? 15 : 0,
            location: Math.round(locationOverlap * 25),
            brand: brandOverlap ? 15 : 0,
            distinctWords: distinctOverlap > 0 ? 5 : 0
        }
    };
};

export const findBestAiMatch = (sourceItem, candidates) => {
    return candidates
        .map(candidate => ({ item: candidate, match: calculateAiMatch(sourceItem, candidate) }))
        .filter(result => result.match.isMatch)
        .sort((first, second) => second.match.score - first.match.score)[0] || null;
};
