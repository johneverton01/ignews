import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
    slug: 'my-new-post',
    title: 'My New post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de Abril',
  };

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

describe('Post Preview Page', () => {
  it('renders correctly', () => {
    const userSessionMocked = mocked(useSession);
    userSessionMocked.mockReturnValueOnce([null, false])
    render(<Post post={post} />);

    expect(screen.getByText("My New post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it('redirects user to full post when user is subscribed', async () => {
     const userSessionMocked = mocked(useSession);
     const userRouterMocked = mocked(useRouter);
     const pushMock = jest.fn();
    userSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false] as any);

      userRouterMocked.mockReturnValueOnce({
        push: pushMock
      } as any);

      render(<Post post={post} />);

      expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  }); 

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { 
              type: 'heading', 
              text: 'My new post' 
            }
          ],
          content: [
            {
              type: 'paragraph',
              text: 'Post content'
            }
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any);

    const response = await getStaticProps({
      params: { slug: 'my-new-post' }
    });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )
  });
})