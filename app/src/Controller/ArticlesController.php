<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Articles Controller
 *
 */
class ArticlesController extends AppController
{
    public function viewClasses(): array {
        return [JsonView::class];
    }

    /**
     * Index method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index() {
        $articles = $this->Articles->find('all')->all();
        $this->set('articles', $articles);
        $this->viewBuilder()->setOption('serialize', ['articles']);
        $this->set(compact('articles'));
    }

    /**
     * View method
     *
     * @param string|null $id Article id.
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($id = null) {

        $article = $this->Articles->get($id);
        $this->set('article', $article);
        $this->viewBuilder()->setOption('serialize', ['article']);

        $article = $this->Articles->get($id, [
            'contain' => [],
        ]);

        $this->set(compact('article'));
    }

    /**
     * Add method
     *
     * @return \Cake\Http\Response|null|void Redirects on successful add, renders view otherwise.
     */
    public function add() {
        if ($this->request->is('post')) {
            $article = $this->Articles->newEntity($this->request->getData());
            if ($this->Articles->save($article)) {
                $message = 'Saved';
                $success = true;
            } else {
                $message = ['Error', $article->getErrors()];
                $success = false;
            }
            $this->set([
                'message' => $message,
                'article' => $article,
                'success' => $success,
            ]);
        }
        $this->viewBuilder()->setOption('serialize', ['article', 'message', 'success']);

        $this->set(compact('article'));
    }

    /**
     * Edit method
     *
     * @param string|null $id Article id.
     * @return \Cake\Http\Response|null|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function edit($id = null) {

        if ($this->request->is(['patch', 'post', 'put'])) {
            $article = $this->Articles->get($id);
            $article = $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $message = 'Saved';
                $success = true;
            } else {
                $message = 'Error';
                $success = false;
            }
            $this->set([
                'message' => $message,
                'article' => $article,
                'success' => $success
            ]);
            $this->viewBuilder()->setOption('serialize', ['article', 'message', 'success']);
        }
        $this->set(compact('article'));
    }

    /**
     * Delete method
     *
     * @param string|null $id Article id.
     * @return \Cake\Http\Response|null|void Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete($id = null) {

        $this->request->allowMethod(['delete']);
        $article = $this->Articles->get($id);
        $message = 'Deleted';
        $success = true;
        if (!$this->Articles->delete($article)) {
            $message = 'Error';
            $success = false;
        }
        $this->set([
            'message' => $message,
            'success' => $success,
        ]);
        $this->viewBuilder()->setOption('serialize', ['message', 'success']);
    }
}
