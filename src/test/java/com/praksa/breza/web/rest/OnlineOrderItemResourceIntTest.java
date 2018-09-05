package com.praksa.breza.web.rest;

import com.praksa.breza.BrezaApp;

import com.praksa.breza.domain.OnlineOrderItem;
import com.praksa.breza.domain.OnlineOrder;
import com.praksa.breza.domain.Article;
import com.praksa.breza.repository.OnlineOrderItemRepository;
import com.praksa.breza.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;


import static com.praksa.breza.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the OnlineOrderItemResource REST controller.
 *
 * @see OnlineOrderItemResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BrezaApp.class)
public class OnlineOrderItemResourceIntTest {

    private static final Long DEFAULT_ORDERED_AMOUNT = 1L;
    private static final Long UPDATED_ORDERED_AMOUNT = 2L;

    private static final Double DEFAULT_ITEM_PRICE = 1D;
    private static final Double UPDATED_ITEM_PRICE = 2D;

    @Autowired
    private OnlineOrderItemRepository onlineOrderItemRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restOnlineOrderItemMockMvc;

    private OnlineOrderItem onlineOrderItem;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OnlineOrderItemResource onlineOrderItemResource = new OnlineOrderItemResource(onlineOrderItemRepository);
        this.restOnlineOrderItemMockMvc = MockMvcBuilders.standaloneSetup(onlineOrderItemResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OnlineOrderItem createEntity(EntityManager em) {
        OnlineOrderItem onlineOrderItem = new OnlineOrderItem()
            .orderedAmount(DEFAULT_ORDERED_AMOUNT)
            .itemPrice(DEFAULT_ITEM_PRICE);
        // Add required entity
        OnlineOrder onlineOrder = OnlineOrderResourceIntTest.createEntity(em);
        em.persist(onlineOrder);
        em.flush();
        onlineOrderItem.setOnlineOrder(onlineOrder);
        // Add required entity
        Article article = ArticleResourceIntTest.createEntity(em);
        em.persist(article);
        em.flush();
        onlineOrderItem.setArticle(article);
        return onlineOrderItem;
    }

    @Before
    public void initTest() {
        onlineOrderItem = createEntity(em);
    }

    @Test
    @Transactional
    public void createOnlineOrderItem() throws Exception {
        int databaseSizeBeforeCreate = onlineOrderItemRepository.findAll().size();

        // Create the OnlineOrderItem
        restOnlineOrderItemMockMvc.perform(post("/api/online-order-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(onlineOrderItem)))
            .andExpect(status().isCreated());

        // Validate the OnlineOrderItem in the database
        List<OnlineOrderItem> onlineOrderItemList = onlineOrderItemRepository.findAll();
        assertThat(onlineOrderItemList).hasSize(databaseSizeBeforeCreate + 1);
        OnlineOrderItem testOnlineOrderItem = onlineOrderItemList.get(onlineOrderItemList.size() - 1);
        assertThat(testOnlineOrderItem.getOrderedAmount()).isEqualTo(DEFAULT_ORDERED_AMOUNT);
        assertThat(testOnlineOrderItem.getItemPrice()).isEqualTo(DEFAULT_ITEM_PRICE);
    }

    @Test
    @Transactional
    public void createOnlineOrderItemWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = onlineOrderItemRepository.findAll().size();

        // Create the OnlineOrderItem with an existing ID
        onlineOrderItem.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOnlineOrderItemMockMvc.perform(post("/api/online-order-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(onlineOrderItem)))
            .andExpect(status().isBadRequest());

        // Validate the OnlineOrderItem in the database
        List<OnlineOrderItem> onlineOrderItemList = onlineOrderItemRepository.findAll();
        assertThat(onlineOrderItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkOrderedAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = onlineOrderItemRepository.findAll().size();
        // set the field null
        onlineOrderItem.setOrderedAmount(null);

        // Create the OnlineOrderItem, which fails.

        restOnlineOrderItemMockMvc.perform(post("/api/online-order-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(onlineOrderItem)))
            .andExpect(status().isBadRequest());

        List<OnlineOrderItem> onlineOrderItemList = onlineOrderItemRepository.findAll();
        assertThat(onlineOrderItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOnlineOrderItems() throws Exception {
        // Initialize the database
        onlineOrderItemRepository.saveAndFlush(onlineOrderItem);

        // Get all the onlineOrderItemList
        restOnlineOrderItemMockMvc.perform(get("/api/online-order-items?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(onlineOrderItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].orderedAmount").value(hasItem(DEFAULT_ORDERED_AMOUNT.intValue())))
            .andExpect(jsonPath("$.[*].itemPrice").value(hasItem(DEFAULT_ITEM_PRICE.doubleValue())));
    }
    

    @Test
    @Transactional
    public void getOnlineOrderItem() throws Exception {
        // Initialize the database
        onlineOrderItemRepository.saveAndFlush(onlineOrderItem);

        // Get the onlineOrderItem
        restOnlineOrderItemMockMvc.perform(get("/api/online-order-items/{id}", onlineOrderItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(onlineOrderItem.getId().intValue()))
            .andExpect(jsonPath("$.orderedAmount").value(DEFAULT_ORDERED_AMOUNT.intValue()))
            .andExpect(jsonPath("$.itemPrice").value(DEFAULT_ITEM_PRICE.doubleValue()));
    }
    @Test
    @Transactional
    public void getNonExistingOnlineOrderItem() throws Exception {
        // Get the onlineOrderItem
        restOnlineOrderItemMockMvc.perform(get("/api/online-order-items/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOnlineOrderItem() throws Exception {
        // Initialize the database
        onlineOrderItemRepository.saveAndFlush(onlineOrderItem);

        int databaseSizeBeforeUpdate = onlineOrderItemRepository.findAll().size();

        // Update the onlineOrderItem
        OnlineOrderItem updatedOnlineOrderItem = onlineOrderItemRepository.findById(onlineOrderItem.getId()).get();
        // Disconnect from session so that the updates on updatedOnlineOrderItem are not directly saved in db
        em.detach(updatedOnlineOrderItem);
        updatedOnlineOrderItem
            .orderedAmount(UPDATED_ORDERED_AMOUNT)
            .itemPrice(UPDATED_ITEM_PRICE);

        restOnlineOrderItemMockMvc.perform(put("/api/online-order-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOnlineOrderItem)))
            .andExpect(status().isOk());

        // Validate the OnlineOrderItem in the database
        List<OnlineOrderItem> onlineOrderItemList = onlineOrderItemRepository.findAll();
        assertThat(onlineOrderItemList).hasSize(databaseSizeBeforeUpdate);
        OnlineOrderItem testOnlineOrderItem = onlineOrderItemList.get(onlineOrderItemList.size() - 1);
        assertThat(testOnlineOrderItem.getOrderedAmount()).isEqualTo(UPDATED_ORDERED_AMOUNT);
        assertThat(testOnlineOrderItem.getItemPrice()).isEqualTo(UPDATED_ITEM_PRICE);
    }

    @Test
    @Transactional
    public void updateNonExistingOnlineOrderItem() throws Exception {
        int databaseSizeBeforeUpdate = onlineOrderItemRepository.findAll().size();

        // Create the OnlineOrderItem

        // If the entity doesn't have an ID, it will throw BadRequestAlertException 
        restOnlineOrderItemMockMvc.perform(put("/api/online-order-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(onlineOrderItem)))
            .andExpect(status().isBadRequest());

        // Validate the OnlineOrderItem in the database
        List<OnlineOrderItem> onlineOrderItemList = onlineOrderItemRepository.findAll();
        assertThat(onlineOrderItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOnlineOrderItem() throws Exception {
        // Initialize the database
        onlineOrderItemRepository.saveAndFlush(onlineOrderItem);

        int databaseSizeBeforeDelete = onlineOrderItemRepository.findAll().size();

        // Get the onlineOrderItem
        restOnlineOrderItemMockMvc.perform(delete("/api/online-order-items/{id}", onlineOrderItem.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<OnlineOrderItem> onlineOrderItemList = onlineOrderItemRepository.findAll();
        assertThat(onlineOrderItemList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OnlineOrderItem.class);
        OnlineOrderItem onlineOrderItem1 = new OnlineOrderItem();
        onlineOrderItem1.setId(1L);
        OnlineOrderItem onlineOrderItem2 = new OnlineOrderItem();
        onlineOrderItem2.setId(onlineOrderItem1.getId());
        assertThat(onlineOrderItem1).isEqualTo(onlineOrderItem2);
        onlineOrderItem2.setId(2L);
        assertThat(onlineOrderItem1).isNotEqualTo(onlineOrderItem2);
        onlineOrderItem1.setId(null);
        assertThat(onlineOrderItem1).isNotEqualTo(onlineOrderItem2);
    }
}
