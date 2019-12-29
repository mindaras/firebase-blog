const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getAllPosts = functions.https.onRequest(async (request, response) => {
  const snapshot = await firestore.collection("posts").get();
  const posts = snapshot.docs.map(post => ({ id: post.id, ...post.data() }));
  response.json({ posts });
});

exports.sanitizeContent = functions.firestore
  .document("posts/{postId}")
  .onWrite(async change => {
    if (!change.after.exists) return;

    const { content, sanitized } = change.after.data();

    if (content && !sanitized) {
      return change.after.ref.update({
        content: content.replace(/CoffeeScript/g, "************"),
        sanitized: true
      });
    }

    return null;
  });

exports.incrementCommentsCount = functions.firestore
  .document("posts/{postId}/comments/{commentId}")
  .onCreate(async (snapshot, context) => {
    const { postId } = context.params;
    const postRef = firestore.doc(`posts/${postId}`);
    const postSnapshot = await postRef.get();
    const commentCount = postSnapshot.get("comments");
    return postRef.update({ comments: commentCount + 1 });
  });
