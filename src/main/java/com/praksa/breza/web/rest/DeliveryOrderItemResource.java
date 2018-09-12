package com.praksa.breza.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.praksa.breza.domain.DeliveryOrderItem;
import com.praksa.breza.repository.DeliveryOrderItemRepository;
import com.praksa.breza.web.rest.errors.BadRequestAlertException;
import com.praksa.breza.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing DeliveryOrderItem.
 */
@RestController
@RequestMapping("/api")
public class DeliveryOrderItemResource {

    private final Logger log = LoggerFactory.getLogger(DeliveryOrderItemResource.class);

    private static final String ENTITY_NAME = "deliveryOrderItem";

    private final DeliveryOrderItemRepository deliveryOrderItemRepository;

    public DeliveryOrderItemResource(DeliveryOrderItemRepository deliveryOrderItemRepository) {
        this.deliveryOrderItemRepository = deliveryOrderItemRepository;
    }

    /**
     * POST  /delivery-order-items : Create a new deliveryOrderItem.
     *
     * @param deliveryOrderItem the deliveryOrderItem to create
     * @return the ResponseEntity with status 201 (Created) and with body the new deliveryOrderItem, or with status 400 (Bad Request) if the deliveryOrderItem has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/delivery-order-items")
    @Timed
    public ResponseEntity<DeliveryOrderItem> createDeliveryOrderItem(@Valid @RequestBody DeliveryOrderItem deliveryOrderItem) throws URISyntaxException {
        log.debug("REST request to save DeliveryOrderItem : {}", deliveryOrderItem);
        if (deliveryOrderItem.getId() != null) {
            throw new BadRequestAlertException("A new deliveryOrderItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DeliveryOrderItem result = deliveryOrderItemRepository.save(deliveryOrderItem);
        return ResponseEntity.created(new URI("/api/delivery-order-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /delivery-order-items : Updates an existing deliveryOrderItem.
     *
     * @param deliveryOrderItem the deliveryOrderItem to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated deliveryOrderItem,
     * or with status 400 (Bad Request) if the deliveryOrderItem is not valid,
     * or with status 500 (Internal Server Error) if the deliveryOrderItem couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/delivery-order-items")
    @Timed
    public ResponseEntity<DeliveryOrderItem> updateDeliveryOrderItem(@Valid @RequestBody DeliveryOrderItem deliveryOrderItem) throws URISyntaxException {
        log.debug("REST request to update DeliveryOrderItem : {}", deliveryOrderItem);
        if (deliveryOrderItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DeliveryOrderItem result = deliveryOrderItemRepository.save(deliveryOrderItem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, deliveryOrderItem.getId().toString()))
            .body(result);
    }

    /**
     * GET  /delivery-order-items : get all the deliveryOrderItems.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of deliveryOrderItems in body
     */
    @GetMapping("/delivery-order-items")
    @Timed
    public List<DeliveryOrderItem> getAllDeliveryOrderItems() {
        log.debug("REST request to get all DeliveryOrderItems");
        return deliveryOrderItemRepository.findAll();
    }

    /**
     * GET  /delivery-order-items/:id : get the "id" deliveryOrderItem.
     *
     * @param id the id of the deliveryOrderItem to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the deliveryOrderItem, or with status 404 (Not Found)
     */
    @GetMapping("/delivery-order-items/{id}")
    @Timed
    public ResponseEntity<DeliveryOrderItem> getDeliveryOrderItem(@PathVariable Long id) {
        log.debug("REST request to get DeliveryOrderItem : {}", id);
        Optional<DeliveryOrderItem> deliveryOrderItem = deliveryOrderItemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(deliveryOrderItem);
    }

    /**
     * DELETE  /delivery-order-items/:id : delete the "id" deliveryOrderItem.
     *
     * @param id the id of the deliveryOrderItem to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/delivery-order-items/{id}")
    @Timed
    public ResponseEntity<Void> deleteDeliveryOrderItem(@PathVariable Long id) {
        log.debug("REST request to delete DeliveryOrderItem : {}", id);

        deliveryOrderItemRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
