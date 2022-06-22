import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@pavlorozhok-org/common'
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('You must suppy a Title'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater then 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket')
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      title: ticket.title,
      price: ticket.price,
      id: ticket.id,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.send(ticket);
  },
);

export { router as updateTicketRouter };
